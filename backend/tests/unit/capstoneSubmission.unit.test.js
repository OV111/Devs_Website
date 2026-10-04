import { describe, it, expect } from 'vitest'
import { parseRepoUrl } from '../../modules/capstone/lib/githubUrl.js'
import { evaluateSubmission } from '../../modules/capstone/lib/autoChecks.js'
import { submitSchema } from '../../modules/capstone/schemas/capstone.schemas.js'
import { MAX_REPO_FILES, MAX_REPO_SIZE_KB } from '../../modules/capstone/lib/constants.js'
import apiDevBrief from '../../seeders/capstones/backend/api-dev.js'

describe('parseRepoUrl', () => {
  it.each([
    ['https://github.com/vahe/notes-api', 'vahe', 'notes-api'],
    ['github.com/vahe/notes-api', 'vahe', 'notes-api'],
    ['https://www.github.com/vahe/notes-api/', 'vahe', 'notes-api'],
    ['https://github.com/vahe/notes-api.git', 'vahe', 'notes-api'],
    ['  https://github.com/Vahe-1/my.github.io  ', 'Vahe-1', 'my.github.io'],
    ['http://github.com/a/b_c', 'a', 'b_c'],
  ])('accepts %s', (input, owner, repo) => {
    expect(parseRepoUrl(input)).toEqual({ owner, repo })
  })

  it.each([
    'https://gitlab.com/vahe/notes-api',
    'https://github.com/vahe',
    'https://github.com/vahe/notes-api/tree/main',
    'https://github.com/vahe/notes-api?x=1',
    'https://github.com.evil.com/vahe/notes-api',
    'https://evil.com/github.com/vahe/notes-api',
    'http://169.254.169.254/latest/meta-data',
    'https://github.com/-vahe/notes-api',
    'https://github.com/vahe/..',
    'https://github.com/vahe/.',
    'https://user:pass@github.com/vahe/notes-api',
    '',
    null,
    42,
  ])('rejects %s', (input) => {
    expect(parseRepoUrl(input)).toBeNull()
  })
})

describe('submitSchema', () => {
  it('turns a URL into { repo: { owner, repo } }', () => {
    expect(submitSchema.parse({ repoUrl: 'github.com/a/b' })).toEqual({ repo: { owner: 'a', repo: 'b' } })
  })

  it('rejects a non-GitHub URL with a field-level message', () => {
    const r = submitSchema.safeParse({ repoUrl: 'https://example.com/a/b' })
    expect(r.success).toBe(false)
    expect(r.error.issues[0].path).toEqual(['repoUrl'])
  })

  it('rejects a missing body field', () => {
    expect(submitSchema.safeParse({}).success).toBe(false)
  })
})

describe('evaluateSubmission', () => {
  const START = new Date('2026-10-03T12:00:00.750Z')
  const requirements = [
    { id: 'readme', text: 'README', check: { type: 'file', glob: 'README.md' } },
    { id: 'ci', text: 'CI', check: { type: 'file', glob: '.github/workflows/*.{yml,yaml}' } },
    { id: 'auth', text: 'Auth works' }, // no check → AI review only
  ]
  const goodFacts = () => ({
    repo: { id: 1, private: false, fork: false, sizeKb: 300, createdAt: new Date('2026-10-04T09:00:00Z') },
    head: { sha: 'abc', treeSha: 'def' },
    stats: { count: 12, rootCommittedAt: new Date('2026-10-04T09:05:00Z') },
    tree: { truncated: false, paths: ['readme.md', '.github/workflows/ci.yaml', 'src/app.js'] },
    firstStartedAt: START,
    repoUsedByOtherUser: false,
    treeSeenFromOtherUser: false,
    requirements,
  })
  const failedIds = (r) => r.checks.filter((c) => !c.passed).map((c) => c.id)

  it('passes a good repository with no flags', () => {
    const r = evaluateSubmission(goodFacts())
    expect(r.passed).toBe(true)
    expect(r.flags).toEqual([])
    // one check per requirement WITH a check; "auth" is left to the AI review
    expect(r.checks.map((c) => c.id)).toContain('req:readme')
    expect(r.checks.map((c) => c.id)).not.toContain('req:auth')
  })

  it('stops early on a missing or private repository', () => {
    for (const repo of [null, { ...goodFacts().repo, private: true }]) {
      const r = evaluateSubmission({ ...goodFacts(), repo })
      expect(r.passed).toBe(false)
      expect(r.checks).toHaveLength(1)
      expect(r.checks[0].id).toBe('repo-public')
    }
  })

  it('stops early on an empty repository', () => {
    const r = evaluateSubmission({ ...goodFacts(), head: null })
    expect(failedIds(r)).toEqual(['not-empty'])
  })

  it('fails forks, reused repos, oversize and truncated trees', () => {
    const f = goodFacts()
    f.repo.fork = true
    f.repoUsedByOtherUser = true
    f.repo.sizeKb = MAX_REPO_SIZE_KB + 1
    f.tree.truncated = true
    expect(failedIds(evaluateSubmission(f))).toEqual(['not-fork', 'repo-unique', 'size', 'file-count'])
  })

  it('fails too many files', () => {
    const f = goodFacts()
    f.tree.paths = [...f.tree.paths, ...Array.from({ length: MAX_REPO_FILES }, (_, i) => `f${i}.js`)]
    expect(failedIds(evaluateSubmission(f))).toEqual(['file-count'])
  })

  it('fails a repository created before the first start', () => {
    const f = goodFacts()
    f.repo.createdAt = new Date('2026-10-03T11:59:59Z')
    expect(failedIds(evaluateSubmission(f))).toEqual(['created-after-start'])
  })

  it('accepts a repository created in the same second as the start (GitHub has no milliseconds)', () => {
    const f = goodFacts()
    f.repo.createdAt = new Date('2026-10-03T12:00:00Z') // START is 12:00:00.750
    expect(evaluateSubmission(f).passed).toBe(true)
  })

  it('fails a missing required file, with the glob in the detail', () => {
    const f = goodFacts()
    f.tree.paths = ['readme.md']
    const r = evaluateSubmission(f)
    expect(failedIds(r)).toEqual(['req:ci'])
    expect(r.checks.find((c) => c.id === 'req:ci').detail).toContain('.github/workflows')
  })

  it('accepts a list of globs, matching any of them (picomatch mishandles braces containing **/)', () => {
    const f = goodFacts()
    f.requirements = [{ id: 'report', text: 'Report', check: { type: 'file', glob: ['docs/**/*.md', '**/{audit,findings}*.md'] } }]
    f.tree.paths = ['README.md', 'AUDIT.md']
    expect(evaluateSubmission(f).passed).toBe(true)
    f.tree.paths = ['README.md']
    const r = evaluateSubmission(f)
    expect(failedIds(r)).toEqual(['req:report'])
    expect(r.checks.find((c) => c.id === 'req:report').detail).toContain('docs/**/*.md or **/{audit,findings}*.md')
  })

  it('raises flags without failing the submission', () => {
    const f = goodFacts()
    f.stats = { count: 1, rootCommittedAt: new Date('2025-01-01T00:00:00Z') }
    f.treeSeenFromOtherUser = true
    const r = evaluateSubmission(f)
    expect(r.passed).toBe(true)
    expect(r.flags.map((x) => x.id)).toEqual(['few-commits', 'history-predates-start', 'duplicate-tree'])
  })
})

describe('api-dev brief globs', () => {
  // A realistic Node project layout must satisfy every automated requirement.
  const paths = [
    'README.md', '.env.example', 'docker-compose.yml', '.github/workflows/ci.yml',
    'src/app.js', 'tests/notes.test.js', 'package.json',
  ]
  it('a well-formed project passes every file requirement', () => {
    const r = evaluateSubmission({
      repo: { id: 1, private: false, fork: false, sizeKb: 100, createdAt: new Date('2026-10-05T00:00:00Z') },
      head: { sha: 'a', treeSha: 'b' },
      stats: { count: 20, rootCommittedAt: new Date('2026-10-05T00:01:00Z') },
      tree: { truncated: false, paths },
      firstStartedAt: new Date('2026-10-04T00:00:00Z'),
      repoUsedByOtherUser: false,
      treeSeenFromOtherUser: false,
      requirements: apiDevBrief.requirements,
    })
    expect(r.checks.filter((c) => !c.passed)).toEqual([])
  })
})

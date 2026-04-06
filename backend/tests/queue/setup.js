import process from 'node:process'

process.env.JWT_Secret = 'test-secret-for-queue-tests'
process.env.REDIS_HOST = '127.0.0.1'
process.env.REDIS_PORT = '6379'

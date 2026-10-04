/**
 * Call the model, validate its output, and retry ONCE if the output is
 * unusable (`err.invalidOutput`). Infrastructure errors (rate limits, outages)
 * are not retried here — they go straight back to the learner as "try again".
 *
 * @param {() => Promise<{content: string, usage: object|null}>} call
 * @param {(content: string) => object} parse  throws err.invalidOutput on bad output
 */
export const callWithOneRetry = async (call, parse, label) => {
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt++) {
    const { content, usage } = await call();
    try {
      return { ...parse(content), usage };
    } catch (err) {
      if (!err.invalidOutput) throw err;
      console.warn(`${label} output rejected (try ${attempt}):`, err.message);
      lastError = err;
    }
  }
  throw lastError;
};

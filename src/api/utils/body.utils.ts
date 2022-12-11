export function parseStringifiedParams(body: any) {
  let steps: any | undefined;
  let ingredients: any | undefined;
  let tags: any | undefined;

  if (typeof body.steps === 'string') {
    try {
      body.steps = JSON.parse(body.steps);
    } catch (err) {}
  }
  if (typeof body.ingredients === 'string') {
    try {
      body.ingredients = JSON.parse(body.ingredients);
    } catch (err) {}
  }
  if (typeof body.tags === 'string') {
    try {
      body.tags = JSON.parse(body.tags);
    } catch (err) {}
  }

  const parsed: any = {};
  if (steps) {
    parsed.steps = Object.assign({}, steps);
  }
  if (ingredients) {
    parsed.ingredients = Object.assign({}, ingredients);
  }
  if (tags) {
    parsed.tags = Object.assign({}, tags);
  }

  return Object.assign({}, body, parsed);
}

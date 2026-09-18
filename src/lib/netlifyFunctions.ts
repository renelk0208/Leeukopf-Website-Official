export function getNetlifyFunctionUrl(functionName: string): string {
  return `/.netlify/functions/${functionName}`;
}

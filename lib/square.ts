import { SquareClient, SquareEnvironment } from 'square'

// Lazy initialization — Square client is only constructed when first accessed,
// not at module load time. This prevents build failures when env vars are absent.
let _client: SquareClient | undefined

export function getSquareClient(): SquareClient {
  if (!_client) {
    _client = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN!,
      environment:
        process.env.SQUARE_ENVIRONMENT === 'production'
          ? SquareEnvironment.Production
          : SquareEnvironment.Sandbox,
    })
  }
  return _client
}

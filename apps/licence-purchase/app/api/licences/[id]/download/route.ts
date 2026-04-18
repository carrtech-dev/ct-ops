import { NextResponse, type NextRequest } from 'next/server'
import { getLicenceById } from '@/lib/actions/licences'

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await ctx.params
  const licence = await getLicenceById(id)
  if (!licence) {
    return new NextResponse('Not found', { status: 404 })
  }

  return new NextResponse(licence.signedJwt, {
    status: 200,
    headers: {
      'Content-Type': 'application/jwt',
      'Content-Disposition': `attachment; filename="infrawatch-licence-${licence.jti}.jwt"`,
      'Cache-Control': 'no-store',
    },
  })
}

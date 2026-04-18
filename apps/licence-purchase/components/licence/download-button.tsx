import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export function DownloadButton({ licenceId }: { licenceId: string }) {
  return (
    <Button asChild>
      <Link href={`/api/licences/${licenceId}/download`}>
        <Download aria-hidden /> Download licence (.jwt)
      </Link>
    </Button>
  )
}

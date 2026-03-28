import type { Metadata } from 'next'
import { OnboardingForm } from './onboarding-form'

export const metadata: Metadata = {
  title: 'Create your organisation',
}

export default function OnboardingPage() {
  return <OnboardingForm />
}

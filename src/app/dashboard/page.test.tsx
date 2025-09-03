import React from 'react'
import { render, screen } from '@testing-library/react'
import { useAuth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import DashboardPage from './page'

// Mock the hooks and redirect
jest.mock('@clerk/nextjs')
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>

describe('DashboardPage Component', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when auth is loading', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ 
        isSignedIn: false, 
        isLoaded: false 
      })
    })

    it('renders loading state', () => {
      render(<DashboardPage />)
      
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('displays loading spinner', () => {
      render(<DashboardPage />)
      
      const spinner = screen.getByText('Loading...').previousElementSibling
      expect(spinner).toHaveClass('animate-spin', 'rounded-full', 'border-b-2', 'border-blue-600')
    })

    it('applies correct background styling', () => {
      render(<DashboardPage />)
      
      const container = screen.getByText('Loading...').closest('div')?.parentElement
      expect(container).toHaveClass('min-h-screen', 'bg-gradient-to-br', 'from-blue-50', 'to-blue-100')
    })
  })

  describe('when user is not signed in', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ 
        isSignedIn: false, 
        isLoaded: true 
      })
    })

    it('redirects to home page', () => {
      render(<DashboardPage />)
      
      expect(mockRedirect).toHaveBeenCalledWith('/')
    })
  })

  describe('when user is signed in', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ 
        isSignedIn: true, 
        isLoaded: true 
      })
    })

    it('renders dashboard page', () => {
      render(<DashboardPage />)
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Dashboard content coming soon...')).toBeInTheDocument()
    })

    it('displays placeholder content', () => {
      render(<DashboardPage />)
      
      expect(screen.getByText('This page will contain your claims overview, statistics, and quick actions.')).toBeInTheDocument()
    })

    it('does not redirect when authenticated', () => {
      render(<DashboardPage />)
      
      expect(mockRedirect).not.toHaveBeenCalled()
    })

    it('applies correct page styling', () => {
      render(<DashboardPage />)
      
      const mainContainer = screen.getByText('Dashboard').closest('div')?.parentElement?.parentElement
      expect(mainContainer).toHaveClass('min-h-screen', 'bg-gradient-to-br', 'from-blue-50', 'to-blue-100')
    })

    it('renders content in a card layout', () => {
      render(<DashboardPage />)
      
      const contentCard = screen.getByText('Dashboard content coming soon...').closest('.bg-white')
      expect(contentCard).toHaveClass('bg-white', 'rounded-lg', 'shadow-lg')
    })
  })

  describe('accessibility', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ 
        isSignedIn: true, 
        isLoaded: true 
      })
    })

    it('has proper heading hierarchy', () => {
      render(<DashboardPage />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Dashboard')
    })

    it('has descriptive text for loading state', () => {
      mockUseAuth.mockReturnValue({ 
        isSignedIn: false, 
        isLoaded: false 
      })
      
      render(<DashboardPage />)
      
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
  })
})
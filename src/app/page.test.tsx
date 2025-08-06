import React from 'react'
import { render, screen } from '@testing-library/react'
import { useAuth, useUser } from '@clerk/nextjs'
import HomePage from './page'

// Mock the hooks
jest.mock('@clerk/nextjs')

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>
const mockUseUser = useUser as jest.MockedFunction<typeof useUser>

describe('HomePage Component', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when user is not signed in', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ isSignedIn: false })
      mockUseUser.mockReturnValue({ user: null })
    })

    it('renders landing page with hero section', () => {
      render(<HomePage />)
      
      // Check for main heading
      expect(screen.getByText('MediClaims')).toBeInTheDocument()
      expect(screen.getByText('Professional Claims Management for Insurance Teams')).toBeInTheDocument()
    })

    it('renders features section', () => {
      render(<HomePage />)
      
      // Check for features section heading
      expect(screen.getByText('Built for Insurance Professionals')).toBeInTheDocument()
      
      // Check for feature items
      expect(screen.getByText('Compliance Ready')).toBeInTheDocument()
      expect(screen.getByText('Efficient Processing')).toBeInTheDocument()
      expect(screen.getByText('Advanced Analytics')).toBeInTheDocument()
    })

    it('renders CTA section with appropriate buttons', () => {
      render(<HomePage />)
      
      expect(screen.getByText('Ready to Transform Your Claims Operations?')).toBeInTheDocument()
      expect(screen.getByText('Request Demo')).toBeInTheDocument()
      expect(screen.getByText('Contact Sales')).toBeInTheDocument()
    })

    it('displays insurance-focused content', () => {
      render(<HomePage />)
      
      // Check for insurance-specific messaging
      expect(screen.getByText(/insurance company staff/)).toBeInTheDocument()
      expect(screen.getByText(/leading insurance companies/)).toBeInTheDocument()
    })

    it('renders hero image with correct alt text', () => {
      render(<HomePage />)
      
      const heroImage = screen.getByAltText('Medical Claims Management for Insurance Professionals')
      expect(heroImage).toBeInTheDocument()
    })
  })

  describe('when user is signed in', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ isSignedIn: true })
      mockUseUser.mockReturnValue({ 
        user: { 
          firstName: 'John', 
          fullName: 'John Doe' 
        } 
      })
    })

    it('renders welcome page for authenticated user', () => {
      render(<HomePage />)
      
      expect(screen.getByText('Welcome John!')).toBeInTheDocument()
      expect(screen.getByText('Ready to review and process medical claims efficiently')).toBeInTheDocument()
    })

    it('renders quick actions for authenticated user', () => {
      render(<HomePage />)
      
      expect(screen.getByText('Quick Actions')).toBeInTheDocument()
      expect(screen.getByText('View Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Access claims overview and analytics')).toBeInTheDocument()
      expect(screen.getByText('Pending Claims')).toBeInTheDocument()
      expect(screen.getByText('Review claims awaiting approval')).toBeInTheDocument()
    })

    it('uses fullName when firstName is not available', () => {
      mockUseUser.mockReturnValue({ 
        user: { 
          firstName: null, 
          fullName: 'Jane Smith' 
        } 
      })
      
      render(<HomePage />)
      expect(screen.getByText('Welcome Jane Smith!')).toBeInTheDocument()
    })

    it('falls back to "User" when no name is available', () => {
      mockUseUser.mockReturnValue({ 
        user: { 
          firstName: null, 
          fullName: null 
        } 
      })
      
      render(<HomePage />)
      expect(screen.getByText('Welcome User!')).toBeInTheDocument()
    })

    it('does not render landing page content when authenticated', () => {
      render(<HomePage />)
      
      // Should not show landing page content
      expect(screen.queryByText('Professional Claims Management for Insurance Teams')).not.toBeInTheDocument()
      expect(screen.queryByText('Request Demo')).not.toBeInTheDocument()
    })
  })

  describe('styling and layout', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ isSignedIn: false })
      mockUseUser.mockReturnValue({ user: null })
    })

    it('applies correct gradient background for authenticated users', () => {
      mockUseAuth.mockReturnValue({ isSignedIn: true })
      mockUseUser.mockReturnValue({ user: { firstName: 'John' } })
      
      render(<HomePage />)
      const container = screen.getByText('Welcome John!').closest('.bg-gradient-to-br')
      expect(container).toHaveClass('bg-gradient-to-br', 'from-blue-50', 'to-blue-100')
    })

    it('has proper responsive classes', () => {
      render(<HomePage />)
      
      // Check for responsive grid classes in features section
      const featuresContainer = screen.getByText('Compliance Ready').closest('div')?.parentElement
      expect(featuresContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-3')
    })
  })
})
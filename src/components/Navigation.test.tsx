import React from 'react'
import { render, screen } from '@testing-library/react'
import { useAuth, useUser } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import Navigation from './Navigation'
import '@testing-library/jest-dom'

// Mock the hooks
jest.mock('@clerk/nextjs')
jest.mock('next/navigation')

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>
const mockUseUser = useUser as jest.MockedFunction<typeof useUser>
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

describe('Navigation Component', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when user is not signed in', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        isSignedIn: false,
      })
      mockUseUser.mockReturnValue({ isLoaded: true, isSignedIn: false, user: null })
    })

    it('renders logo', () => {
      render(<Navigation />)
      const logo = screen.getByAltText('MediClaims Logo')
      expect(logo).toBeInTheDocument()
    })

    it('renders login and sign up buttons', () => {
      render(<Navigation />)
      expect(screen.getByText('Login')).toBeInTheDocument()
      expect(screen.getByText('Sign Up')).toBeInTheDocument()
    })

    it('does not render navigation links', () => {
      render(<Navigation />)
      expect(screen.queryByText('Home')).not.toBeInTheDocument()
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
    })

    it('does not render user button', () => {
      render(<Navigation />)
      expect(screen.queryByTestId('user-button')).not.toBeInTheDocument()
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

    it('renders navigation links', () => {
      render(<Navigation />)
      expect(screen.getByTestId('desktop-home-link')).toBeInTheDocument()
      expect(screen.getByTestId('desktop-dashboard-link')).toBeInTheDocument()
    })

    it('renders user button', () => {
      render(<Navigation />)
      expect(screen.getByTestId('user-button')).toBeInTheDocument()
    })

    it('does not render login and sign up buttons', () => {
      render(<Navigation />)
      expect(screen.queryByText('Login')).not.toBeInTheDocument()
      expect(screen.queryByText('Sign Up')).not.toBeInTheDocument()
    })

    it('highlights active page - home', () => {
      mockUsePathname.mockReturnValue('/')
      render(<Navigation />)
      const homeLink = screen.getByTestId('desktop-home-link')
      expect(homeLink).toHaveClass('bg-blue-600')
    })

    it('highlights active page - dashboard', () => {
      mockUsePathname.mockReturnValue('/dashboard')
      render(<Navigation />)
      const dashboardLink = screen.getByTestId('desktop-dashboard-link')
      expect(dashboardLink).toHaveClass('bg-blue-600')
    })

    it('applies correct styling to navigation bar', () => {
      render(<Navigation />)
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveStyle('background-color: #1993e2')
    })
  })

  describe('accessibility', () => {
    it('has proper navigation landmark', () => {
      mockUseAuth.mockReturnValue({ isSignedIn: false })
      render(<Navigation />)
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('logo has proper alt text', () => {
      mockUseAuth.mockReturnValue({ isSignedIn: false })
      render(<Navigation />)
      expect(screen.getByAltText('MediClaims Logo')).toBeInTheDocument()
    })
  })
})
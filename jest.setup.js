import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname: jest.fn(() => '/'),
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // Handle Next.js specific props by converting them to valid HTML attributes
    const { src, alt, width, height, fill, priority, className, ...rest } = props
    const imgProps = {
      src,
      alt,
      width: width || undefined,
      height: height || undefined,
      className,
      ...rest
    }
    
    // Convert boolean props to strings if needed
    if (fill) imgProps['data-fill'] = 'true'
    if (priority) imgProps['data-priority'] = 'true'
    
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...imgProps} />
  },
}))

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn(() => ({ isSignedIn: false })),
  useUser: jest.fn(() => ({ user: null })),
  SignInButton: ({ children }) => <div data-testid="sign-in-button">{children}</div>,
  SignUpButton: ({ children }) => <div data-testid="sign-up-button">{children}</div>,
  UserButton: () => <div data-testid="user-button" />,
}))
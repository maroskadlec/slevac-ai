import { useChatContext } from '../contexts/ChatContext'
import FigmaDesktop from '../components/FigmaDesktop'

function DesktopPage() {
  const { isModalOpen: isDesktopOpen, setIsModalOpen: setIsDesktopOpen } = useChatContext()

  return (
    <div className="w-full h-screen overflow-hidden">
      <FigmaDesktop 
        isOpen={isDesktopOpen} 
        onToggle={() => setIsDesktopOpen(!isDesktopOpen)} 
      />
    </div>
  )
}

export default DesktopPage

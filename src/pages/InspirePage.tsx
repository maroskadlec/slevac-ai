import { useChatContext } from '../contexts/ChatContext'
import FigmaMobileInspire from '../components/FigmaMobileInspire'

function InspirePage() {
  const { isModalOpen, setIsModalOpen } = useChatContext()

  return (
    <div className="bg-white">
      <FigmaMobileInspire 
        isOpen={isModalOpen} 
        onToggle={() => setIsModalOpen(!isModalOpen)} 
      />
    </div>
  )
}

export default InspirePage

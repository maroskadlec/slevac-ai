import { useChatContext } from '../contexts/ChatContext'
import FigmaMobile from '../components/FigmaMobile'

function FigmaMCP() {
  const { isModalOpen, setIsModalOpen } = useChatContext()

  return (
    <div className="bg-white">
      <FigmaMobile 
        isOpen={isModalOpen} 
        onToggle={() => setIsModalOpen(!isModalOpen)} 
      />
    </div>
  )
}

export default FigmaMCP

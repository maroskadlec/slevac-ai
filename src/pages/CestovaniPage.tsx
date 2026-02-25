import { useChatContext } from '../contexts/ChatContext'
import FigmaMobileCestovani from '../components/FigmaMobileCestovani'

function CestovaniPage() {
  const { isModalOpen, setIsModalOpen } = useChatContext()

  return (
    <div className="bg-white">
      <FigmaMobileCestovani 
        isOpen={isModalOpen} 
        onToggle={() => setIsModalOpen(!isModalOpen)} 
      />
    </div>
  )
}

export default CestovaniPage

import { useChatContext } from '../contexts/ChatContext'
import FigmaMobileDealDetail from '../components/FigmaMobileDealDetail'

function DealDetailPage() {
  const { isModalOpen, setIsModalOpen } = useChatContext()

  return (
    <div className="bg-white">
      <FigmaMobileDealDetail
        isOpen={isModalOpen}
        onToggle={() => setIsModalOpen(!isModalOpen)}
      />
    </div>
  )
}

export default DealDetailPage

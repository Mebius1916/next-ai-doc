import ChatDialog from '@/app/ai-assistant/page'
import React from 'react'
const AiChat = ({ closeDialog}: {closeDialog: () => void}) => {
  return (
    <>
    <div
      className="fixed inset-0 bg-black/50 z-10"
      onClick={closeDialog}
    />
    <div
      className="fixed h-[95vh] w-2/3 bg-[#EBEFFF] top-1/2 left-1/2 -translate-x-1/2 
    -translate-y-1/2 z-20 min-w-80 rounded-xl shadow-xl"
    >
      <ChatDialog/>
    </div>
  </>
  )
}

export default AiChat
import { useCallback, useState } from 'react';

export const useModalStateValue = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return {
    closeModal: useCallback(() => setModalOpen(false), []),
    isModalOpen,
    openModal: useCallback(() => setModalOpen(true), [])
  };
};

export default useModalStateValue;

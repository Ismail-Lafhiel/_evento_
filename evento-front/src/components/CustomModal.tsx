// src/components/Modal.tsx
import { Modal } from "flowbite-react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const CustomModal = ({
  isOpen,
  onClose,
  children,
  title,
}: CustomModalProps) => {
  return (
    <Modal show={isOpen} onClose={onClose} size="xl">
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default CustomModal;

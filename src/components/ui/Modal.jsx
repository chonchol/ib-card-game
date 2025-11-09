const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &#x2715; Close
        </button>
        {children}
      </div>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-bold">Confirm Action</h2>
      <p className="text-gray-700">Are you sure you want to proceed?</p>
      <div
        className="flex justify-end
                            space-x-4 mt-4"
      >
        <button
          className="px-4 py-2 bg-gray-500
                               text-white rounded-lg"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-red-500
                               text-white rounded-lg"
          onClick={onConfirm}
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;

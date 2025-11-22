"use client";

type DeleteSeasonModalProps = {
  open: boolean;
  onClose: () => void;
  seasonName: string;
  onConfirm: () => void;
};

export default function DeleteSeasonModal({
  open,
  onClose,
  seasonName,
  onConfirm,
}: DeleteSeasonModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold mb-4 text-red-600">
          Xóa Giải Đấu?
        </h2>

        <p className="text-gray-600 mb-6">
          Bạn có chắc muốn xóa giải <b>"{seasonName}"</b>?<br />
          Hành động này không thể hoàn tác.
        </p>

        <div className="flex gap-3">
          <button
            className="flex-1 py-3 bg-gray-200 rounded-xl"
            onClick={onClose}
          >
            Hủy
          </button>

          <button
            className="flex-1 py-3 bg-red-600 text-white rounded-xl"
            onClick={onConfirm}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

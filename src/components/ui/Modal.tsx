type ModalProps = {
    children: React.ReactNode;
};

export default function Modal({ children }: ModalProps) {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-[#020617] p-6 rounded-xl">{children}</div>
        </div>
    );
}
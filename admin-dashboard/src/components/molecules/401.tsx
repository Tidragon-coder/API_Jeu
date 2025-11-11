type ErreurProps = {
    number: number;
    message?: string;
};

export default function Erreur({ number, message }: ErreurProps) {
    if (number === 401) {
        return (
            <div className="rounded-xl p-6 text-center flex flex-col items-center justify-center bg-red-50 border border-red-300 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24"><path fill="#c00" d="M1 21L12 2l11 19zm11-3q.425 0 .713-.288T13 17t-.288-.712T12 16t-.712.288T11 17t.288.713T12 18m-1-3h2v-5h-2z"/></svg>
                <h3 className="text-3xl font-bold text-gray-500">{number}</h3>
                <p className="text-2xl font-bold text-red-600 mb-2">Unauthorized</p>
                <p className="text-lg text-red-500">
                    {message
                        ? message 
                        : "You are not authorized to access this page. Please log in again to continue."}
                </p>
                <a href="/login"><button className="bg-[#4F7C77] text-white px-4 py-2 rounded-lg hover:opacity-80 mt-4">Se connecter</button></a>
            </div>
        );
    }

    return (
        <div className="rounded-xl p-6 text-center flex flex-col items-center justify-center bg-red-50 border border-gray-300 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24"><path fill="#c00" d="M1 21L12 2l11 19zm11-3q.425 0 .713-.288T13 17t-.288-.712T12 16t-.712.288T11 17t.288.713T12 18m-1-3h2v-5h-2z"/></svg>
            <h3 className="text-3xl font-bold text-gray-500">{number}</h3>
            <p className="text-xl text-gray-700">
                {message || "An unexpected error occurred."}
            </p>
        </div>
    );
}

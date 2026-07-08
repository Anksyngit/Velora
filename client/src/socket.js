io(import.meta.env.VITE_BACKEND_URL)

const socket = io("http://localhost:4000");

export default socket;
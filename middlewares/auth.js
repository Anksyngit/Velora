export const protect = async (req, res, next) => {
    try {
        const authData = await req.auth()
        console.log('authData:', authData)  // 👈 add this
        const { userId } = authData
        if (!userId) {
            return res.json({ success: false, message: "not authenticated" })
        }
        next()
    } catch (error) {
        console.log('error:', error)  // 👈 and this
        res.json({ success: false, message: error.message })
    }
}
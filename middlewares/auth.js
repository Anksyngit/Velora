export const protect = async (req, res, next) => {
  try {
    const authData = await req.auth();

    console.log("Auth Data:", authData);

    if (!authData.userId) {
      return res.json({
        success: false,
        message: "Not authenticated",
      });
    }

    req.auth = authData;

    next();

  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};
export function sendResponse(c, status, message, data) {
    const isSuccess = status >= 200 && status < 300;
    const respData = {
        status,
        success: isSuccess,
        message,
        data: data ?? null,
    };
    return c.json(respData, status);
}

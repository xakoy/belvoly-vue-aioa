export async function isInApp() {
    if (!window.BM) {
        return false
    }
    return new Promise<boolean>((resolve, reject) => {
        BM.appointment.driver.getLaster(data => {
            resolve(data.platform === 'android' || data.platform === 'ios')
        })
    })
}

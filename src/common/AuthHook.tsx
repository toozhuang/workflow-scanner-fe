import {useEffect, useState} from "react"
import {auth} from "../api/login.api"

/**
 * 验证是否登录的 Hook；
 * 该原理就是cookie + get
 * 看是否有正确的对象返回
 * 可以在任何地方使用
 * @constructor
 */
const AuthHook = () => {
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        let didCancel = false;
        const isLogin = async () => {
            setIsError(false)
            setIsLoading(true)
            try {
                const {data: {status}} = await auth()
                if (!didCancel) {
                    // @ts-ignore
                    if (parseInt(status) < 0) {
                        setIsError(true)
                    }
                    setIsLoading(false)
                }

            } catch (error) {
                if (!didCancel) {
                    setIsError(true)
                    setIsLoading(false)
                }

            }
        }

        isLogin()

        return () => {
            didCancel = true   //  也就是已经为 false 了
        }
    }, [])

    return [{isError, isLoading}]
}

export default AuthHook

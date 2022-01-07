import {useEffect, useState} from "react"
import {auth} from "../api/authentication.api"

/**
 * 验证是否登录的 Hook；
 * 传入当前的用户的 cookie 来决定
 * 该用户是否登录成功
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

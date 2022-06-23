import { useCallback, useState } from 'react'

/**
 * @description 复杂内容的弹窗控制器
 * @param initVisible 
 * @param initialInfo 
 */
export const useModal = <ExtralInfo = any>(initVisible = false, initialInfo?: ExtralInfo) => {
  const [state, setModal] = useState({
    visible: initVisible,
    extraInfo: initialInfo
  })

  const openModal = useCallback((nextInfo?: ExtralInfo) => {
    setModal({
      visible: true,
      extraInfo: nextInfo,
    })
  }, [])

  const closeModal = useCallback(() => {
    setModal(prevState => ({
      visible: false,
      extraInfo: prevState.extraInfo
    }))
  }, [])

  return {
    ...state,
    openModal,
    closeModal
  }
}

/**
 * @description 简单的表单控制工具
 * @param initialData 
 */
export const useForm = <T = object>(initialData?: T) => {
  const [values, setForm] = useState<T>(initialData || {} as T)
  const handleChange = useCallback((name: keyof T) => (v: any) => setForm(vs => ({ ...vs, [name]: v })), [])

  return {
    values,
    handleChange
  }
}
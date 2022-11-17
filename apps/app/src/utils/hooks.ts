import { useCallback, useState } from 'react'
import { hideLoading, showLoading } from './feedback'

/**
 * 复杂内容的弹窗控制器
 * @param initVisible
 * @param initialData
 */
export const useModal = <T = any>(initVisible = false, initialData?: T) => {
  const [state, setModal] = useState({
    visible: initVisible,
    modalData: initialData,
  })

  const openModal = useCallback((nextData?: T) => {
    setModal({
      visible: true,
      modalData: nextData,
    })
  }, [])

  const closeModal = useCallback(() => {
    setModal((prevState) => ({
      visible: false,
      modalData: prevState.modalData,
    }))
  }, [])

  return {
    ...state,
    openModal,
    closeModal,
  }
}

/**
 * 简单的表单控制工具
 * @param initialData
 */
export const useForm = <T = object, R = any>(props: {
  initialData?: T
  submittingMsg?: string
  onSubmit: (values: T) => Promise<R>
  onBeforeSubmit?: (values: T) => boolean
  onAfterSubmit?: (result: R) => void
}) => {
  const { initialData, onBeforeSubmit, onSubmit, onAfterSubmit, submittingMsg = '资料提交中' } = props

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [values, setForm] = useState<T>(initialData || ({} as T))
  const handleChange = useCallback((name: keyof T) => (v: any) => setForm((vs) => ({ ...vs, [name]: v })), [])

  const handleSubmit = async () => {
    if (!!onBeforeSubmit && !onBeforeSubmit(values)) {
      // 校验不通过
      return
    }

    showLoading(submittingMsg)
    setIsSubmitting(true)

    const result = await onSubmit(values)

    setIsSubmitting(false)
    hideLoading()

    if (!!onAfterSubmit) {
      onAfterSubmit(result)
    }

    return result
  }

  return {
    values,
    isSubmitting,
    handleChange,
    handleSubmit,
  }
}

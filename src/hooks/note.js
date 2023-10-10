import axios from '@/lib/axios'
import { useToasts } from 'react-toast-notifications'
import { useRouter } from 'next/router'

export const noteAPI = () => {
    const { addToast } = useToasts()
    const router = useRouter()

    const createAuthor = async ({ setErrors, ...props }) => {
        setErrors([])
        axios
            .post('/api/authors/notes', props)
            .then(res => {
                addToast(res.data.message, {
                    appearance: 'success',
                    autoDismiss: true,
                })
                router.push(`/authors/${props.author.id}/notes`)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(Object.values(error.response.data.errors).flat())
                addToast('Error al crear el formulario', {
                    appearance: 'error',
                    autoDismiss: true,
                })
            })
    }

    const editAuthor = async ({ setErrors, ...props }, id) => {
        setErrors([])
        axios
            .put(`/api/authors/notes/${id}`, props)
            .then(res => {
                addToast(res.data.message, {
                    appearance: 'success',
                    autoDismiss: true,
                })
                router.push(`/authors/${props.author.id}/notes`)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(Object.values(error.response.data.errors).flat())
                addToast('Error al edita el formulario', {
                    appearance: 'error',
                    autoDismiss: true,
                })
            })
    }

    const destroyAuthor = async id => {
        axios
            .delete(`/api/authors/notes/${id}`)
            .then(res => {
                addToast(res.data.message, {
                    appearance: 'succes',
                    autoDismiss: true,
                })
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                addToast('Error al eliminar el Formulario', {
                    appearance: 'error',
                    autoDismiss: true,
                })
            })
    }

    return {
        createAuthor,
        editAuthor,
        destroyAuthor,
    }
}

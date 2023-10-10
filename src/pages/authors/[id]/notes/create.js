import AppLayout from '@/components/Layouts/AppLayout'
import head from 'next/head'
import { useEffect, useState } from 'react'
import { noteAPI } from '@/hooks/note'
import { useRouter } from 'next/router'
import AuthValidationErrors from '@/components/AuthValidationErrors'
import Button from '@/components/Button'
import Label from '@/components/Label'
import Textarea from '@/components/TextArea'
import PreviousLink from '@/components/PreviousLink'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth'

const createNotes = () => {
    const { createAuthor, editAuthor } = noteAPI()
    const { user } = useAuth({ middleware: 'auth' })
    const [errors, setErrors] = useState([])
    const router = useRouter()
    const [description, setDescription] = useState('')
    const [writing_date, setWritingDate] = useState('')
    const [id, setAuthorId] = useState('')
    const [full_name, setFullName] = useState('')
    const [user_id, setUserId] = useState(user.id)

    const currentDate = () => {
        const date = new Date()
        let day = date.getDate()
        let month = date.getMonth() + 1
        if (month < 10) {
            month = '0' + month
        }
        let year = date.getFullYear()
        setWritingDate(`${year}-${month}-${day}`)
    }

    useEffect(() => {
        axios
            .get(`/api/authors/${router.query.id}`)
            .then(res => {
                setFullName(res.data.author.full_name)
                setAuthorId(res.data.author.id)
            })
            .catch(error => {
                if (error.response.status !== 409) throw error
            })

        if (router.query.idNote) {
            axios
                .get(`/api/authors/notes/${router.query.idNote}`)
                .then(resTwo => {
                    setDescription(resTwo.data.description)
                    setWritingDate(resTwo.data.writing_date)
                })
                .catch(errorTwo => {
                    if (errorTwo.response.status !== 409) throw errorTwo
                })
        }

        currentDate()
    }, [router.query.id])

    const submitForm = event => {
        event.preventDefault()
        if (!router.query.idNote) {
            createAuthor({
                description,
                writing_date,
                author: {
                    id,
                    full_name,
                },
                user: { id: user_id },
                setErrors,
            })
        } else {
            editAuthor(
                {
                    description,
                    writing_date,
                    author: { id, full_name },
                    user: { id: user_id },
                    setErrors,
                },
                router.query.idNote,
            )
        }
    }

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {router.query.idNote
                        ? 'Editar Notas de autor'
                        : 'Crear Notas de autor'}
                    :{full_name}
                </h2>
            }>
            <AuthValidationErrors classname="mb-4" errors={errors} />
            <form onSubmit={submitForm}>
                <div className="md:w-8/12 lg:w-5/12 lg:ml-20">
                    <div className="mb-3 xl:w-96">
                        <Label htmlFor="description">Nota</Label>
                        <Textarea
                            id="description"
                            rows="3"
                            value={description}
                            onChange={event =>
                                setDescription(event.target.value)
                            }
                            placeholder="Nota"
                        />
                    </div>
                    <Button>Guardar Perfil de autor</Button>
                </div>
            </form>
            <div className="flex justify-end">
                <PreviousLink
                    href={{
                        pathname: '/authors/[id]/notes',
                        query: {
                            id: router.query.id,
                        },
                    }}
                    as={`/authors/${router.query.id}/notes`}
                />
            </div>
        </AppLayout>
    )
}

export default createNotes

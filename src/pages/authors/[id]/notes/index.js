import AppLayout from '@/components/Layouts/AppLayout'
import head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from '@/lib/axios'
import Button from '@/components/Button'
import EditLink from '@/components/EditLink'
import { noteAPI } from '@/hooks/note'
import DeleteButton from '@/components/DeleteButton'

const Notes = () => {
    const [notes, setNotes] = useState([])
    const [author_id, setAuthorid] = useState('')
    const [full_name, setFullName] = useState('')
    const { destroyAuthor } = noteAPI()
    const router = useRouter()

    useEffect(() => {
        axios
            .get(`/api/authors/${router.query.id}/notes`)
            .then(res => {
                setNotes(res.data.notes)
                setAuthorid(res.data.author.id)
                setFullName(res.data.author.full_name)
            })
            .catch(error => {
                if (error.response.status !== 409) throw error
            })
    }, [])

    function FormatDate(data) {
        const date = new Date(data.replace(/-/g, '/'))
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }
        return date.toLocaleDateString('es-MX', options)
    }

    function destroyItem(id) {
        if (confirm('¿Seguro que desea eliminar el elemento seleccionado?')) {
            destroyAuthor(id)
            setNotes([...notes.filter(note => note.id !== id)])
        }
    }

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Notas de autor: {full_name}
                </h2>
            }>
            <div className="flex space-x-2 justify-start">
                <Button
                    type="button"
                    onClick={() =>
                        router.push(
                            '/authors/[id]/notes/create',
                            `/authors/${author_id}/notes/create`,
                        )
                    }>
                    Nueva Nota de autor
                </Button>
            </div>
            <table className="min-w-full">
                <tbody>
                    {notes?.map(note => (
                        <tr className="bg-white border-b" key={note.id}>
                            <td className="text-sm text-gray-900 font-light px-6">
                                <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">
                                    Fecha: ({FormatDate(note.writing_date)})
                                </h5>
                                {note.description}
                            </td>
                            <td className="flex space-x-2 text-sm text-gray-900 font-light px-6 py-4">
                                <EditLink
                                    href={{
                                        pathname: `/authors/[author_id]/notes/edit/[note_id]`,
                                        query: {
                                            author_id: router.query.id,
                                            id: note.id,
                                        },
                                    }}
                                    as={`/authors/${router.query.id}/notes/edit/${note.id}`}
                                />
                                <DeleteButton
                                    onClick={e => {
                                        e.stopPropagation()
                                        destroyItem(note.id)
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </AppLayout>
    )
}

export default Notes

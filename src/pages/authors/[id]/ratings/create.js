import AppLayout from '@/components/Layouts/AppLayout'
import head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from '@/lib/axios'
import AuthValidationErrors from '@/components/AuthValidationErrors'
import Button from '@/components/Button'
import Label from '@/components/Label'
import PreviousLink from '@/components/PreviousLink'
import Select from '@/components/Select'
import Star from '@/components/Star'
import NotStar from '@/components/NotStar'
import { ratingAPI } from '@/hooks/rating'
import { useAuth } from '@/hooks/auth'

const ratingCreate = () => {
    const { createAuthor, editAuthor } = ratingAPI()
    const { user } = useAuth({ middleware: 'auth' })
    const router = useRouter()
    const [errors, setErrors] = useState([])
    const [author_id, setAuthoriid] = useState('')
    const [full_name, setFullName] = useState('')
    const [stars, setStars] = useState(1)
    const [rating_id, setRating] = useState('')
    const [user_id, setUserId] = useState(user.id)

    useEffect(() => {
        axios
            .get(`/api/authors/${router.query.id}/ratings`)
            .then(res => {
                setFullName(res.data.author.full_name)
                setAuthoriid(res.data.author.id)
                if (res.data.rating != '') {
                    setStars(parseInt(res.data.rating[0].number_star))
                    setRating(res.data.rating[0].id)
                }
            })
            .catch(error => {
                if (error.response.status !== 409) throw error
            })
    }, [router.query.id])

    const starChose = val => {
        setStars(val)
    }

    const submitForm = event => {
        event.preventDefault()
        if (!rating_id) {
            createAuthor({
                setErrors,
                number_star: stars,
                author: { id: author_id },
                user: { id: user_id },
            })
        } else {
            editAuthor(
                {
                    number_star: stars,
                    author: { id: author_id },
                    user: {
                        id: user_id,
                    },
                    setErrors,
                },
                rating_id,
            )
        }
    }

    return (
        <AppLayout header={<h2>Puntuar Autor: {full_name}</h2>}>
            <AuthValidationErrors className="mb-4" errors={errors} />
            <form onSubmit={submitForm}>
                <div className="md:w-8/12 lg:w-5/12 lg:ml-20">
                    <div className="mb-3 xl:w-96">
                        <Label htmlFor="description">Estrellas:</Label>
                        <Select
                            onChange={val => starChose(val.target.value)}
                            value={stars}>
                            <option value="1">Uno</option>
                            <option value="2">Dos</option>
                            <option value="3">Tres</option>
                            <option value="4">Cuatro</option>
                            <option value="5">Cinco</option>
                        </Select>
                    </div>
                    <div className="mb-3 xl:w-96">
                        <ul className="flex">
                            {[...Array(parseInt(stars))].map((star, index1) => (
                                <Star key={index1} className="w-8" />
                            ))}
                            {[...Array(5 - stars)].map((star, index) => (
                                <NotStar key={index} className="w-8" />
                            ))}
                        </ul>
                    </div>
                    <Button>Puntuar Actor</Button>
                </div>
            </form>
            <div className="flex justify-end">
                <PreviousLink href="/authors" />
            </div>
        </AppLayout>
    )
}

export default ratingCreate

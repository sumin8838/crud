'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface EditTopicFormProps {
  id: string
  title: string
  description: string
}

export default function EditTopicForm({
  id,
  title,
  description,
}: EditTopicFormProps) {
  const [newTitle, setNewTitle] = useState(title)
  const [newDescription, setNewDescription] = useState(description)
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/topics/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newTitle, newDescription }),
      })
      if (!res.ok) {
        throw new Error('토픽 수정에 실패했습니다.')
      }
      router.push('/')
      router.refresh()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input
        type="text"
        className="border border-slate-800 p-4"
        placeholder="Topic Title"
        value={newTitle}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNewTitle(e.target.value)
        }
      />
      <textarea
        className="border border-slate-500 p-4 h-32"
        placeholder="Topic Description"
        value={newDescription}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setNewDescription(e.target.value)
        }
      />
      <button
        className="bg-green-800 hover:bg-green-900 text-white font-bold px-6 py-3 w-fit rounded-md"
        type="submit"
      >
        Update Topic
      </button>
    </form>
  )
}

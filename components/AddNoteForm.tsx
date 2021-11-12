import Input from '@/components/ui/Input'
import UploadImageBucket from '@/components/UploadImageBucket'
import UserContext from '@/lib/UserContext'
import { supabase } from 'lib/Store'
import dynamic from 'next/dynamic'
import { useContext, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
const EditorJs = dynamic(() => import('react-editor-js'), { ssr: false })

let editorInstance: any

const AddNoteForm = ({ setOpen }) => {
  const [title, setTitle] = useState<string | null>('')
  const { user } = useContext(UserContext)
  const [notes, setNotes] = useState<string[]>([])
  const [selectedTopicId, setSelectedTopicId] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const [editorTools, setEditorTools] = useState<any>()

  let editorComponent
  if (!editorTools) editorComponent = 'Loading...'
  else {
    editorComponent = (
      <div className='unreset'>
        <EditorJs
          instanceRef={instance => (editorInstance = instance)}
          tools={editorTools}
          placeholder={`Vamos a escribir una tarjeta maravillosa!`}
        />
      </div>
    )
  }

  useEffect(() => {
    const importConstants = async () => {
      const tools = (await import('@/components/Editor/EditorConstants')).default
      setEditorTools(tools)
    }

    importConstants()
  }, [])

  useEffect(() => {
    const fetchTopics = async () => {
      const { data: notes, error } = await supabase.from('notes').select('id, title')

      if (error) {
        toast.error(error.message)
        return
      }

      setNotes(notes)
    }

    fetchTopics()
  }, [])

  const _onSaveCard = async (e, editorInstance) => {
    e.preventDefault()

    const noteData = await editorInstance.save()

    setLoading(true)
    try {
      if (!title || title === '') {
        setLoading(false)
        return toast.error('Por favor de añadir un título')
      }

      if (!noteData.blocks[0]) {
        setLoading(false)
        return toast.error('Por favor de añadir información en la tarjeta')
      }

      const { error } = await supabase.from('notes').insert([
        {
          title,
          data: noteData.blocks,
          user_id: user.id
        }
      ])

      if (error) {
        console.log(error)
        toast.error('Error al crear tarjeta')
        setLoading(false)
      }

      toast.success('Tarjeta creada')
      location.reload()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <form onSubmit={e => _onSaveCard(e, editorInstance)}>
      <Toaster />
      <div>
        <div className='sm:col-span-6'>
          <label htmlFor='title' className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Título
          </label>
          <div className='mt-1'>
            <Input
              type='text'
              value={title}
              onChange={setTitle}
              maxLength={50}
              required
              className='shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm dark:text-gray-300 dark:bg-gray-700 border-gray-300 dark:border-gray-400 rounded-md'
            />
          </div>
        </div>
        <UploadImageBucket path={`notes/${selectedTopicId}`} />
        <div className='sm:col-span-6 mt-4'>
          <label htmlFor='topic-id' className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Nota
          </label>
          <div className='bg-white mt-2 rounded-md p-2 border-2'>{editorComponent}</div>
        </div>
      </div>

      <div className='pt-5'>
        <div className='flex justify-end'>
          <button
            disabled={loading}
            onClick={() => setOpen(false)}
            type='button'
            className='bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-400 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'>
            Cancelar
          </button>
          <button
            disabled={loading}
            type='submit'
            className='ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'>
            Guardar
            {loading && <i className='fa fa-circle-o-notch fa-spin py-1 px-1'></i>}
          </button>
        </div>
      </div>
    </form>
  )
}

export default AddNoteForm

import AddNoteForm from '@/components/AddNoteForm'
import EditorRenderer from '@/components/EditorRenderer'
import FAB from '@/components/FAB'
import Layout from '@/components/Layout'
import Modal from '@/components/Modal'
import Slider from '@/components/Slider'
import { supabase, useStore } from '@/lib/Store'
import { Dialog } from '@headlessui/react'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

const NotesPage = props => {
  const router = useRouter()
  const messagesEndRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const cancelButtonRef = useRef(null)

  // Else load up the page
  const { id: channelId } = router.query
  const { channels } = useStore({ channelId })

  useEffect(() => {
    const fetchNotes = async () => {
      let { data: notes, error } = await supabase.from('notes').select('*')
      if (error) {
        return toast.error(error.message)
      }
      setNotes(notes)
    }

    fetchNotes()
  }, [])

  const _handleOpenNote = note => {
    setSelectedNote(note)
    setOpenModal(true)
  }

  // Render the notes
  return (
    <Layout channels={channels} activeChannelId={channelId}>
      <div className='relative h-screen'>
        <div className='Messages h-full pb-16'>
          <div className='p-2 overflow-y-auto'>
            <button
              onClick={() => setOpen(!open)}
              type='button'
              className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
              Agregar Nota +
            </button>
            <div className='flex flex-wrap justify-center'>
              {notes.length ? (
                notes.map(note => (
                  <div className='w-full md:w-1/2 lg:w-1/3 p-3'>
                    <div className='bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-5'>
                      <div className='flex flex-col items-center'>
                        <div className='flex-1'>
                          <h2 className='text-2xl font-semibold dark:text-gray-50'>{note.title}</h2>
                        </div>
                        <div className='mt-5 sm:mt-6 sm:grid sm:gap-3 sm:grid-flow-row-dense'>
                          <button
                            onClick={() => _handleOpenNote(note)}
                            className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-indigo-500 text-base font-medium  hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-white sm:mt-0 sm:col-start-1 sm:text-sm'>
                            Ver
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='mx-auto h-12 w-12 text-gray-400'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                    No hay notas que mostrar
                  </h3>
                  <p className='mt-1 text-sm text-gray-500'>Vuelva más tarde, seguro que se agregarán más.</p>
                </div>
              )}
            </div>
            <FAB setOpen={setOpen} />
            <Slider open={open} setOpen={setOpen} title={'Agregar Nota'}>
              <AddNoteForm setOpen={setOpen} />
            </Slider>
            <Modal open={openModal} setOpen={setOpenModal} cancelButtonRef={cancelButtonRef}>
              <div className='inline-block align-bottom bg-white dark:bg-gray-700 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'>
                {selectedNote && (
                  <>
                    <div>
                      <div className='mt-3 text-center sm:mt-5'>
                        <Dialog.Title as='h3' className='text-lg leading-6 font-medium text-gray-900 dark:text-gray-50'>
                          {selectedNote.title}
                        </Dialog.Title>
                        <div className='relative mt-4 mb-8'>
                          <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                            <div className='w-full border-t border-gray-300 dark:border-gray-500' />
                          </div>
                          <div className='relative flex justify-center'>
                            {/* <span className="px-2 bg-white dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-400">
                      Tarjeta
                    </span> */}
                          </div>
                        </div>
                        <div className='unreset text-gray-800 dark:text-white mt-4'>
                          <EditorRenderer data={selectedNote.data} />
                        </div>
                      </div>
                    </div>
                    <div className='mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense'>
                      <button
                        type='button'
                        className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:col-start-1 sm:text-sm'
                        onClick={() => setOpenModal(false)}
                        ref={cancelButtonRef}>
                        Cerrar
                      </button>
                    </div>
                  </>
                )}
              </div>
            </Modal>
            <div ref={messagesEndRef} style={{ height: 0 }} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default NotesPage

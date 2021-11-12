import { supabase } from 'lib/Store'
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const UploadImage = ({ path }) => {
  const [imageSelected, setImageSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState('')

  const handleImage = (image: any) => {
    let preview = URL.createObjectURL(image)
    return { preview: preview, raw: image }
  }

  useEffect(() => {
    const uploadImage = async () => {
      setLoading(true)
      const bucketPath = `${path}/${uuidv4()}.${imageSelected.raw.type.split('/')[1]}`
      const { error } = await supabase.storage.from('public').upload(bucketPath, imageSelected.raw, {
        cacheControl: '3600',
        upsert: true
      })

      if (error) {
        setLoading(false)
        return toast.error(error.message)
      }

      const { publicURL, error: urlError } = supabase.storage.from('public').getPublicUrl(bucketPath)

      if (urlError) {
        setLoading(false)
        return toast.error(urlError.message)
      }

      setLoading(false)
      setUrl(publicURL)
    }

    if (imageSelected) {
      uploadImage()
    }
  }, [imageSelected])

  return (
    <div className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
      <Toaster />
      <div className='sm:col-span-6'>
        <label htmlFor='first-name' className='block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
          Subir imagen al bucket y generar image link{' '}
          {loading && <i className='fa fa-circle-o-notch fa-spin py-1 px-1'></i>}
          {url && ': '}
          {url && (
            <CopyToClipboard text={url} onCopy={() => toast.success('Se ha copiado el link en el portapapeles')}>
              <span className='text-teal-500 cursor-pointer'>{`${`${url.substring(0, 15)}...${url.substring(
                url.length - 15,
                url.length
              )}`}`}</span>
            </CopyToClipboard>
          )}
        </label>
        <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-400 border-dashed rounded-md'>
          <div className='space-y-1 text-center'>
            {imageSelected ? (
              <img className='mx-auto object-scale-down rounded-md h-20 w-full' src={imageSelected.preview} alt='' />
            ) : (
              <svg
                className='mx-auto h-12 w-12 text-gray-400'
                stroke='currentColor'
                fill='none'
                viewBox='0 0 48 48'
                aria-hidden='true'>
                <path
                  d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            )}

            <div className='flex text-sm justify-center text-gray-600'>
              <label
                htmlFor='file-upload'
                className='relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-teal-500 hover:text-teal-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500'>
                <span>Subir un archivo</span>
                <input
                  id='file-upload'
                  name='file-upload'
                  type='file'
                  className='sr-only'
                  onChange={e => setImageSelected(handleImage(e.target.files[0]))}
                />
              </label>
              <p className='pl-1 dark:text-gray-400'>o suéltalo aquí</p>
            </div>
            <p className='text-xs text-gray-500 dark:text-gray-300'>PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadImage

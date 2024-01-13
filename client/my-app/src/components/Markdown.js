import React, { useRef, memo } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const  Markdown = ({label, value, changeValue,name, invalidFields, setInvalidFields}) => {
  
  return (
    <div className='flex flex-col'>
        <span className='mt-6'>{label}</span>
      <Editor
        apiKey='1xtfsk59e2394u6mxbgem9lvg3zsch62d49rbvob920vj0j5'
        initialValue={value}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar: 'undo redo | formatselect | ' +
          'bold italic backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
        onChange={e => changeValue(prev => ({...prev,[name]: e.target.getContent()}))}
       

      />
      {invalidFields?.some(el => el.name === name) && <small className='text-main'>{invalidFields?.find(el => el.name === name)?.mes}</small>}
    </div>
  );
}
export default memo(Markdown)
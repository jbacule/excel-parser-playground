<template>
  <div class="container">
    <div class="header">
      <h1>Excel Parser Playground (ExcelJs)</h1>
    </div>
    <div class="error-container" v-if="error_message">{{ error_message }}</div>
    <div class="form-container">
      <input id="file" type="file" @change="handleFileUpload" />
      <div class="form-right">
        <button @click="loadSample" style="width: 100px; margin-right: 5px;">Load Sample</button>
        <button @click="reset" style="width: 100px; margin-right: 5px;">Reset</button>
        <button @click="submit" :disabled="loading" style="width: 100px;">{{ loading ? 'Parsing' : 'Parse' }}</button>
      </div>
    </div>
    <div class="code-container">
      <prism-editor class="my-editor" v-model="code" :highlight="highlighter" line-numbers></prism-editor>
    </div>

    <div class="result-container">
      <span>Result:</span>
      <pre>{{ result }}</pre>
    </div>

    <div class="footer-container">
      <span>Made with ExpressJs, ExcelJs and Vue 3</span> | <a href="https://github.com/shujo/excel-parser-playground" target="_blank">Github</a>
    </div>
  </div>
  
</template>

<script>
import api from './api';
import { ref, onMounted } from 'vue'

// import Prism Editor
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css'; // import syntax highlighting styles

export default {
  name: 'App',
  components: {
    PrismEditor
  },
  setup(){
    const code = ref('');
    const result = ref('');
    const loading = ref(false);
    const file = ref(null);
    const error_message = ref('');

    const highlighter = (code) => {
        return highlight(code, languages.js);
    }

    const navigate = (href, newTab) => {
      var a = document.createElement('a');
      a.href = href;
      if (newTab) {
          a.setAttribute('target', '_blank');
      }
      a.click();
    }

    const reset = async () => {
      document.getElementById('file').value = []
      result.value = '';
      let response = await api.get('/api/load-default');
      code.value = response.data.code
      error_message.value = ''
    }

    const loadSample = async () => {
      result.value = '';
      let response = await api.get('/api/load-sample');
      code.value = response.data.code
      error_message.value = ''
      await navigate(response.data.file, true)
    }

    const handleFileUpload = (e) => {
      file.value = e.target.files[0]
    }

    const submit = async () => {
      loading.value = true
      result.value = ''
      try {
        let formData = new FormData();
        formData.append('file', file.value)
        formData.append('code', code.value)
        
        let response = await api.post('/api/upload', formData)
        result.value = response.data
      } catch (error) {
        error_message.value = error.data.message
      } finally {
        loading.value = false
      }
    }

    onMounted(reset)

    return {
      error_message,
      loading,
      code,
      result,
      highlighter,
      handleFileUpload,
      submit,
      reset,
      loadSample
    }
  }
}
</script>

<style>
body{
  margin: 0;
  padding: 0;
  width: 100%;
}
.container{
  padding: 10px;
  width: 90%;
  margin: auto;
}

.error-container{
  border-radius: 5px;
  width: 100%;
  height: 15px;
  border: 2px solid #c44d56;
  background-color: #fe7968;
  padding: 15px 0;
  color: #fff;
  font-size: 600;
  font-family: monospace;
  text-align: center;
  margin-bottom: 10px;
}

.form-container {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

.code-container{
  width: auto;
  height: 500px;
}

.result-container{
  margin-top: 20px;
  border-radius: 5px;
  width: auto;
  height: auto;
  max-height: 600px;
  overflow: auto;
  padding: 10px;
  background-color: #ececec;
  border: 2px solid #abb7b7;
}

.footer-container{
  text-align: center;
  margin-top: 15px;
  color: #6c7a89;
}

/* required class */
.my-editor {
  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  background: #2d2d2d;
  color: #ccc;
  border-radius: 5px;

  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
  width: auto;
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}
</style>

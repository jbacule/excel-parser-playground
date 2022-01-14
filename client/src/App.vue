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
      <CodeEditor v-model="code" width="auto" height="600px" font_size="12px" :wrap_code="true" border_radius="5px"></CodeEditor>
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
import CodeEditor from 'simple-code-editor';
import axios from 'axios';
import { ref, onMounted } from 'vue'
export default {
  name: 'App',
  components: {
    CodeEditor
  },
  setup(){
    const code = ref('')
    const result = ref('')
    const loading = ref(false)
    const file = ref(null)
    const error_message = ref('')

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
      let response = await axios.get('/api/load-default');
      code.value = response.data.code
    }

    const loadSample = async () => {
      result.value = '';
      let response = await axios.get('/api/load-sample');
      code.value = response.data.code
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
        
        let response = await axios.post('/api/upload', formData)
        result.value = response.data
      } catch (error) {
        console.log(error)
        error_message.value = error.message
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
  height: 600px;
}

.result-container{
  margin-top: 10px;
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
</style>

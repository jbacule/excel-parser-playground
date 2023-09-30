<script setup lang="ts">
useHead({
  title: 'ExcelJs Parser Playground',
  meta: [
    { name: 'description', content: 'A parser playground for ExcelJs Nodejs libraray.' }
  ],
})

const code = ref<string | undefined>('');
const result = ref('');
const loading = ref(false);
const files = ref<File[]>([]);
const error_message = ref('');

const navigate = (href: string, newTab: boolean) => {
  var a = document.createElement('a');
  a.href = href;
  if (newTab) {
      a.setAttribute('target', '_blank');
  }
  a.click();
}

const reset = async () => {
  const fileInput = document.getElementById('file') as HTMLInputElement
  fileInput.value = ''
  result.value = '';
  const { data } = await useFetch('/api/load-default');
  code.value = data.value?.code
  error_message.value = ''
}

const loadSample = async () => {
  result.value = '';
  const { data } = await useFetch('/api/load-sample');
  error_message.value = ''
  code.value = data.value?.code
  
  if(data.value?.file){
    const confirmed = await confirm('Sample code will be loaded. Do you want to also download a sample file?')
    if(confirmed){
      navigate(data.value?.file, true)
    }
    return
  }
}

const handleFileUpload = (e: any) => {
  files.value = e.target.files
}

const submit = async () => {
  loading.value = true
  result.value = ''
  try {
    const formData = new FormData();
    for(const file of files.value){
      formData.append('files', file)
    }
    formData.append('code', code.value as string)
    
    const response = await $fetch('/api/upload', {
      method: "post",
      body: formData
    })

    result.value = response
  } catch (error: any) {
    error_message.value = error.message
  }finally{
    loading.value = false
  }
}

onMounted(() => {
  reset()
})
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>ExcelJs Parser Playground</h1>
    </div>
    <div class="error-container" v-if="error_message">{{ error_message }}</div>
    <div class="form-container">
      <input id="file" type="file" @change="handleFileUpload($event)" />
      <div class="form-right">
        <button @click="loadSample" style="width: 100px; margin-right: 5px;">Load Sample</button>
        <button @click="reset" style="width: 100px; margin-right: 5px;">Reset</button>
        <button @click="submit" :disabled="loading" style="width: 100px;">{{ loading ? 'Parsing' : 'Parse' }}</button>
      </div>
    </div>
    <div class="code-container">
      <MonacoEditor class="editor" v-model="code" lang="javascript"  />
    </div>

    <div class="result-container">
      <span>Result:</span>
      <pre>{{ result }}</pre>
    </div>

    <div class="footer-container">
      <span>Made with Nuxt 3 and ExcelJs</span> | <a href="https://github.com/jbacule/excel-parser-playground" target="_blank">Github</a>
    </div>
  </div>
</template>

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

.editor {
  height: 400px;
  border: 1px solid #848484;
}
</style>
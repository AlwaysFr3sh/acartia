<template>
    <div class="upload-container">
        <div class="header">
            <h1>Upload Sightings</h1>
        </div>
        <Tabs>
            <Tab title="Manual Upload">
              <div class="manual-upload">
                  <form class="manual-form">
                      <div class ="input">
                          <label>Date Sighted*</label>
                      <input type="date" required="True">
                      </div>
                      <div class ="input">
                          <label >Species*</label>
                          <select required="True">
                              <option value=""></option>
                              <option value="whale1">Whale 1</option>
                              <option value="whale1">Whale 2</option>
                              <option value="whale1">Whale 3</option>
                              <option value="whale1">Whale 4</option>
                          </select>
                      </div>
                      <div class ="input">
                          <label>Pod</label>
                          <select>
                              <option value=""></option>
                              <option value="pod1">Pod 1</option>
                              <option value="pod2">Pod 2</option>
                              <option value="pod3">Pod 3</option>
                              <option value="pod4">Pod 4</option>
                          </select>
                      </div>
                      <div class ="input">
                          <label>Number Sightings*</label>
                      <select required="True">
                          <option value=""></option>
                          <option value="no1">Number 1</option>
                          <option value="no2">Number 2</option>
                          <option value="no3">Number 3</option>
                          <option value="no4">Number 4</option>
                      </select>
                      </div>
                      <div class ="input">
                          <label>Observed Behaviours</label>
                          <select>
                              <option value=""></option>
                              <option value="behaviour1">behaviour 1</option>
                              <option value="behaviour2">behaviour 2</option>
                              <option value="behaviour3">behaviour 3</option>
                              <option value="behaviour4">behaviour 4</option>
                          </select>
                      </div>
                      <div class ="input">
                          <label>Additional notes </label>
                      <textarea></textarea>
                      </div>
                      <div class ="input">
                          <input type="submit" id="submit-btn" value="Upload sighting">
                      </div>
                  </form>
              </div>
            </Tab>
            <Tab title="File Upload">
              <div class="file-upload">
                <div class="file-msg">
                    <p>Import your data as a csv file.</p>
                    <p>Use the template to format your data before uploading.</p>
                </div>
                <a class="btn btn-primary" data-mdb-ripple-init href="/https://github.com/salish-sea/acartia" role="button" id="upload-btn">
                  <span>Upload file</span>
                  <img src="@/assets/white-upload.svg" alt="Upload Icon" class="upload-icon" />
                </a>
                <a class="btn btn-primary" data-mdb-ripple-init href="/https://github.com/salish-sea/acartia" role="button" id="download-btn">
                    <span>Download template</span>
                    <img src="@/assets/download-blue.svg" alt="Download Icon" class="download-icon" />
                  </a>
                <div class="download-btn"></div>
              </div>
            </Tab>
        </Tabs>

        <div class="links">
            <h2>Want to do more? Check out these links!</h2>
            <div class="row">
                <a class="a" data-mdb-ripple-init href="/integrate" role="button" id="btns">
                    <img src="@/assets/htc-icon.svg" alt="Hand Icon" class="cont-icon" />
                    How to Contribute
                    <img src="@/assets/right-icon.svg" alt="Right Icon" class="righticon" />
                    <span>New to uploading data? Click here to learn how you can provide data.</span>
                </a>
                <a class="btn btn-primary" data-mdb-ripple-init href="https://github.com/salish-sea/acartia" target="_blank" role="button" id="btns">
                    <img src="@/assets/git-icon.svg" alt="GitHub Icon" class="cont-icon" />
                    Github
                    <img src="@/assets/right-icon.svg" alt="Right Icon" class="righticon" />
                    <span>Integrate your application with Acartia.</span>
                </a>
                <a class="btn btn-primary" data-mdb-ripple-init href="/contact-us" role="button" id="btns">
                  <img src="@/assets/right-icon.svg" alt="Right Icon" class="righticon" />
                  <img src="@/assets/mail-icon.svg" alt="Mail Icon" class="cont-icon" />
                  Contact us
                  <span>Get in touch with Acartia.</span>
                </a>
            </div>
        </div>
  </div>
</template>

<script>
import Tabs from './UploadPageComponents/Tabs.vue'
import Tab from './UploadPageComponents/Tab.vue'

export default {
  components: {
    Tabs,
    Tab
  }
}
</script>

<style scoped>
.IP {
    padding-top: 12px;
}

.input button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 24px 10px 24px;
    width: 327px;
    height: 48px;
    background: rgba(238, 241, 244, 1);
    border-radius: 10px;
    color: rgba(61, 57, 81, 1);
    font-family: 'Montserrat';
    font-size: 16px;
    font-weight: 600;
    margin-top: 12px;
}

.upload-container {
    font-family: 'Montserrat';
    color: rgba(61, 57, 81, 1);
}

.header h1 {
    font-family: 'Mukta';
    font-size: 32px;
    font-weight: 600;
    line-height: 32px;
    text-align: center;
    display: block;
    width: 375px;
    height: auto;
    margin: auto;
    padding-top: 96px;
    padding-bottom: 24px;
    color: rgba(61, 57, 81, 1);
}

h2 {
    font-family: 'Mukta';
    font-size: 28px !important;
    font-weight: 600 !important;
    line-height: 29.4px;
    text-align: center;
}

.manual-upload {
    width: 1120px;
    height: auto;
    padding: 0px 160px 0px 160px;
    padding-top: 24px;
    padding-bottom: 24px;
    margin: auto;
}

.input {
  width: 327px;
  height: auto;
  display: flex;
  flex-direction: column;
  margin: auto;
  padding-bottom: 24px;
  padding-top: 24px;
}

.input label {
  font-family: 'Montserrat';
  font-weight: 500;
  font-size: 12px;
  color: rgba(61, 57, 81, 1);
  margin-bottom: 0px;
  padding: 0px 4px 4px 4px;
}

.input input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #3d3951;
  border-radius: 4px;
  font-family: 'Montserrat';
  font-weight: 500;
  font-size: 16px;
  color: rgba(61, 57, 81, 1);
}

.input select {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #3d3951;
  border-radius: 4px;
  font-family: 'Montserrat';
  font-weight: 500;
  font-size: 16px;
  color: rgba(61, 57, 81, 1);
}

.input textarea {
    width: 327px;
    height: 204px;
    color: rgba(61, 57, 81, 1);
    border-radius: 6px;
    font-family: 'Montserrat';
    font-size: 16px;
    font-weight: 500;
    padding: 12px;
}

#submit-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 24px 10px 24px;
    width: 327px;
    height: 48px;
    background: #00AFBA;
    border: none;
    border-radius: 10px;
    color: rgba(255, 255, 255, 1);
    font-family: 'Montserrat';
    font-size: 16px;
    font-weight: 500;
}

.file-upload {
  margin-top: 24px;
  padding-bottom: 114px;
}

.file-msg {
  width: 327px;
  height: 88px;
  margin: auto;
  margin-bottom: 24px;
}

.file-msg p{
  line-height: 22.4px;
}

#upload-btn {
  display: block;
  width: 327px;
  height: 48px;
  background: #00AFBA !important;
  border: none;
  border-radius: 10px;
  color: rgba(255, 255, 255, 1);
  font-family: 'Montserrat';
  font-size: 16px;
  font-weight: 500;
  text-transform: none;
  box-shadow: none;
  margin: auto;
  margin-bottom: 24px;
}

.upload-icon {
  padding-bottom: 2px;
  padding-left: 8px;
}

#download-btn {
  display: block;
  width: 327px;
  height: 48px;
  background: white !important;
  border: 1px solid rgba(31, 85, 134, 1);
  border-radius: 10px;
  color: rgba(31, 85, 134, 1);
  font-family: 'Montserrat';
  font-size: 16px;
  font-weight: 500;
  text-transform: none;
  box-shadow: none;
  margin: auto;
  margin-bottom: 24px;
}


.download-icon {
  padding-bottom: 2px;
  padding-left: 8px;
}

.links {
    font-family: 'Montserrat';
    text-align: left;
    position: relative;
    width: 1120px;
    height: auto;
    margin: auto;
    padding-top: 64px;
}

.cont-icon {
    max-width: 25%;
    max-height: 25%;
    margin-right: 6px;
    margin-bottom: 4px;
}

.righticon {
    float: right;
    padding-top: 2px;
    padding-right: 0px;
}

#btns {
    display: block;
    padding: 24px;
    border: none;
    border-radius: 12px;
    background-color: rgba(240, 251, 251, 1) !important;
    text-decoration: none;
    width: 327px;
    height: 127px;
    box-shadow: none;
    font-family: 'Mukta';
    font-weight: 500;
    font-size: 24px;
    text-align: left;
    line-height: 25.2px;
    color: rgba(61, 57, 81, 1);
    text-transform: none;
    margin: 12px;
}

#btns span {
    font-family: 'Montserrat';
    font-weight: 400;
    font-size: 16px;
    line-height: 22.4px;
    display: inline-block;
    padding-top: 6px;
}

#contact-btn {
    display: block;
    padding: 24px;
    border: none;
    border-radius: 12px;
    background-color: rgba(240, 251, 251, 1) !important;
    text-decoration: none;
    width: 327px;
    height: auto;
    box-shadow: none;
    font-family: 'Mukta';
    font-weight: 500;
    font-size: 24px;
    text-align: left;
    line-height: 25.2px;
    color: rgba(61, 57, 81, 1);
    text-transform: none;
    margin: auto;
}

#contact-btn span {
    font-family: 'Montserrat';
    font-weight: 400;
    font-size: 16px;
    line-height: 22.4px;
    display: inline-block;
    padding-top: 6px;
}

.row {
    margin-top: 24px;
    margin-bottom: 24px;
}
</style>

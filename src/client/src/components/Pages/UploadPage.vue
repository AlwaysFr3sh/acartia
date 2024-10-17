<template>
  <div id="upload-container">
    <div class="header">
      <h1>Upload Sightings</h1>
    </div>
    <div class="tab">
      <!-- Tabs navs -->
      <ul class="nav nav-tabs nav-justified mb-3" id="ex1" role="tablist">
        <li class="nav-item" role="presentation">
          <a data-mdb-tab-init class="nav-link active" id="ex3-tab-1" href="#ex3-tabs-1" role="tab"
            aria-controls="ex3-tabs-1" aria-selected="true">Manual Upload</a>
        </li>
        <li class="nav-item" role="presentation">
          <a data-mdb-tab-init class="nav-link" id="ex3-tab-2" href="#ex3-tabs-2" role="tab" aria-controls="ex3-tabs-2"
            aria-selected="false">File upload</a>
        </li>
      </ul>
      <!-- Tabs navs -->
    </div>
    <div id="manual-upload">
      <form class="manual-form">
        <div class="input">
          <label>Date Sighted*</label>
          <input type="text" v-model="sighting.created" required>
        </div>
        <div class="input">
          <label>Latitude*</label>
          <input type="text" v-model="sighting.latitude" required>
        </div>
        <div class="input">
          <label>Longitude*</label>
          <input type="text" v-model="sighting.longitude" required>
        </div>
        <div class="input">
          <label>Species*</label>
          <input type="text" v-model="sighting.type" required>
        </div>
        <div class="input">
          <label>Pod</label>
          <input type="text" v-model="sighting.pod">
        </div>
        <div class="input">
          <label>Number Sighted*</label>
          <input type="number" v-model="sighting.no_sighted" required>
        </div>
        <div class="input">
          <label>Additional notes</label>
          <textarea v-model="sighting.data_source_comments"></textarea>
        </div>
      </form>
    </div>
    <div class="input">
      <input type="submit" id="submit-btn" value="Upload sighting" @click.prevent="uploadSighting">
    </div>

    <div class="links">
      <h2>Want to contribute to Acartia? Check out these links!</h2>
      <div class="row">
        <a class="btn btn-primary" data-mdb-ripple-init href="/integrate" role="button" id="btns">
          <img src="@/assets/htc-icon.svg" alt="Hand Icon" class="cont-icon" />
          How to Contribute
          <img src="@/assets/right-icon.svg" alt="Right Icon" class="righticon" />
          <span>New to uploading data? Click here to learn how you can provide data.</span>
        </a>
        <a class="btn btn-primary" data-mdb-ripple-init href="https://github.com/salish-sea/acartia" target="_blank"
          role="button" id="btns">
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
import axios from 'axios'

export default {
  name: 'About',
  data() {
    return {
      sighting: {
        data_source_id: "",
        data_source_witness: "",
        data_source_entity: "",
        data_source_name: "Spotter-API",
        no_sighted: "",
        latitude: "",
        longitude: "",
        type: '',
        data_source_comments: "",
        created: "",
        photo_url:"",
      }
    };
  },
  methods: {
    async uploadSighting() {
      let requestAuth;

      //only allow upload if user is signed in
      if (this.$store.state.userDetails.token) {
        requestAuth.headers = {
          'Authorization': 'Bearer ' + process.env.VUE_APP_MASTER_KEY,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }

      try {
        let res = await axios.post('http://localhost:9000', this.sighting, requestAuth)
        console.log("success: ", res)
      } catch (error) {
        console.log(error)
      }
    }
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

.tab {
  width: 1120px;
  height: auto;
  margin: auto;
  font-family: 'Montserrat';
  font-weight: 600;
  font-size: 16px;
}

#manual-upload {
  width: 1120px;
  height: auto;
  padding: 0px 160px 0px 160px;
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
  border-radius: 10px;
  color: rgba(255, 255, 255, 1);
  font-family: 'Montserrat';
  font-size: 16px;
  font-weight: 500;
}

.links {
  font-family: 'Montserrat';
  text-align: left;
  position: relative;
  width: 1120px;
  height: auto;
  margin: auto;
  padding-top: 24px;
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

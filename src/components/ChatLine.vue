<template>
	<div class="chatbubble" :class="{ 'is-pulled-right has-text-right has-background-light' : line.owned, 'is-pulled-left has-text-left has-background-white' : !line.owned, 'has-background-primary' : line.sender === 'bot' }">
	  <strong v-if="line.sender != 'bot'" v-html="line.sender"></strong>
	  <span v-html="line.text" :class="{ 'has-text-grey' : line.sender === 'bot' }"></span>
	  <span v-if="line.sender != 'bot'" v-html="line.ts" class="is-size-7 has-text-grey"></span>
	</div>
</template>
 
<script>
export default {
  props: {
    line: {}
  }
}
</script> 
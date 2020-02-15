<template>
  <div>
    <b>#{{item._id}}</b>
    <span>{{ item.name }}</span>
    <abbr>{{item.registration_date}}</abbr>
  </div>
</template>
 
<script>
export default {
  props: {
    item: { required: true },
    searchText: { required: true }
  }
}
</script> 
<template>
  <div>
    <b>{{item.name}}</b>
    <span>{{item.registration_date}}</span>
    <abbr>{{item._id}}</abbr>
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
<!-- src/views/user/tourneys/TourneyDetails.vue -->
<template>
  <div>
    <SubMenuComponent :tourneyId="tourneyId" />

    <!-- Contenu de la page -->
    <div class="p-6">
      <TitleComponent title="Informations" />
    </div>
  </div>
</template>

<script>
  import SubMenuComponent from '@/components/user/SubMenuComponent.vue';
  import TitleComponent from '@/components/TitleComponent.vue';

  export default {
    components: {
      SubMenuComponent,
      TitleComponent,
    },
    data() {
      return {
        tourneyId: this.$route.params.tourneyId,
      };
    },
    methods: {},
  };
</script>

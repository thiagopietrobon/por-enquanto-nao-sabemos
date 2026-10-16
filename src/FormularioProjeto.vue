<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const rota = useRoute()

const modoEdicao = computed(() => Boolean(rota.params.id))
</script>
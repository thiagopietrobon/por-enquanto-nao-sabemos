<template>
  <div class="app-shell">
    <header class="cabecalho">
      <div class="cabecalho-conteudo">
        <RouterLink class="marca" to="/" aria-label="Gerenciador de tarefas — início">
          <span class="marca-icone" aria-hidden="true">GT</span>
          <span>Gerenciador de tarefas</span>
        </RouterLink>

        <nav class="navegacao" aria-label="Navegação principal">
          <RouterLink to="/" class="link-nav" exact-active-class="ativo">Tarefas</RouterLink>
          <RouterLink to="/projetos" class="link-nav" active-class="ativo">Projetos</RouterLink>
        </nav>
      </div>
    </header>

    <main class="conteudo-principal">
      <RouterView />
    </main>

    <footer class="rodape">Gerenciador de Tarefas Acadêmicas</footer>
  </div>
</template>
